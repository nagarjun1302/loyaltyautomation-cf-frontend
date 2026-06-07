"use client";

import { ArrowLeft, ChevronLeft, ChevronRight, Download, FileText, MessageSquare, PackageSearch, PlayCircle, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CustomerNavbar, Footer } from "../../components/CustomerChrome";
import InquiryModal from "../../components/InquiryModal";
import { formatPrice, normalizeCategoryName, productImages, productSpecs, uniqueCategories, uploadUrl } from "../../lib/catalog";

export default function ProductVisitPage({ products = [], companyInfo = null }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [expandedProductId, setExpandedProductId] = useState("");
  const [inquiryProduct, setInquiryProduct] = useState(null);
  const [activeImages, setActiveImages] = useState({});

  const categories = useMemo(() => uniqueCategories(products), [products]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = searchParams.get("category");
    const productIdFromUrl = searchParams.get("productId");

    if (categoryFromUrl) setSelectedCategory(categoryFromUrl);

    if (products.length > 0 && productIdFromUrl) {
      const productFromUrl = products.find((product) => product._id === productIdFromUrl);
      if (productFromUrl) {
        setSelectedProductId(productFromUrl._id);
        setExpandedProductId(productFromUrl._id);
        setActiveImages((current) => ({ ...current, [productFromUrl._id]: productImages(productFromUrl)[0] || "" }));
        if (productFromUrl.category && !categoryFromUrl) setSelectedCategory(normalizeCategoryName(productFromUrl.category));
      }
    }
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = selectedCategory === "All" || normalizeCategoryName(product.category) === selectedCategory;
      const matchesSearch =
        !query ||
        [product.title, product.category, product.description, product.Brand, product.ModelNumber, ...(product.specifications || []).flatMap((spec) => [spec.label, spec.value])]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const selectedCategoryProducts = useMemo(() => {
    if (selectedCategory === "All") return [];
    return products
      .filter((product) => normalizeCategoryName(product.category) === selectedCategory)
      .sort((a, b) => String(a.title || "").localeCompare(String(b.title || "")));
  }, [products, selectedCategory]);

  const selectedProduct = useMemo(() => {
    if (!selectedProductId) return null;
    return products.find((product) => product._id === selectedProductId) || null;
  }, [products, selectedProductId]);

  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return filteredProducts;
    return filteredProducts.filter((product) => product._id !== selectedProduct._id);
  }, [filteredProducts, selectedProduct]);

  useEffect(() => {
    if (!selectedProductId) return;
    const timeout = window.setTimeout(() => {
      document.getElementById("selected-product-specs")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(timeout);
  }, [selectedProductId, selectedCategory, filteredProducts]);

  const selectProduct = (product) => {
    setSelectedProductId(product._id);
    setExpandedProductId("");
    setActiveImages((current) => ({ ...current, [product._id]: current[product._id] || productImages(product)[0] || "" }));
    setSelectedCategory(product.category ? normalizeCategoryName(product.category) : "All");
    router.push(`/customer/customervisit?productId=${product._id}`);
  };

  const viewProduct = (product) => {
    setSelectedProductId(product._id);
    setExpandedProductId(product._id);
    setActiveImages((current) => ({ ...current, [product._id]: current[product._id] || productImages(product)[0] || "" }));
    setSelectedCategory(product.category ? normalizeCategoryName(product.category) : "All");
    router.push(`/customer/customervisit?productId=${product._id}`);
  };

  const setProductImage = (productId, image) => {
    setActiveImages((current) => ({ ...current, [productId]: image }));
  };

  const chooseCategory = (categoryKey) => {
    setSelectedCategory(categoryKey);
    setSelectedProductId("");
    setExpandedProductId("");
    if (categoryKey === "All") {
      router.push("/customer/customervisit");
    } else {
      router.push(`/customer/customervisit?category=${encodeURIComponent(categoryKey)}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerNavbar
        searchQuery={searchQuery}
        onSearchChange={(event) => setSearchQuery(event.target.value)}
        categories={categories}
        products={products}
      />

      <main className="px-4 py-6 lg:ml-[250px] lg:px-6">
        <section className="grid gap-5 lg:block">
          <aside className="no-scrollbar lg:fixed lg:left-0 lg:top-[73px] lg:z-30 lg:h-[calc(100vh-73px)] lg:w-[250px] lg:overflow-y-auto lg:border-r lg:border-slate-200 lg:bg-white lg:px-4 lg:py-5 lg:shadow-sm">
            <div className="rounded-md border border-slate-200 bg-white p-3 shadow-sm lg:border-0 lg:p-0 lg:shadow-none">
              <button onClick={() => router.push("/")} className="mb-4 inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-black text-slate-700 hover:border-slate-300 hover:text-teal-800">
                <ArrowLeft className="h-4 w-4" /> Back to homepage
              </button>

              <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-3">
                <SlidersHorizontal className="h-4 w-4 text-teal-700" />
                <div>
                  <h2 className="text-sm font-black text-slate-950">Catalog Filter</h2>
                  <p className="text-xs font-bold text-slate-400">{filteredProducts.length} products</p>
                </div>
              </div>

              <label className="relative block">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search catalog"
                  className="focus-ring h-10 w-full rounded-md border border-slate-200 bg-slate-50 pl-8 pr-2 text-sm font-bold text-slate-900"
                />
              </label>

              <div className="mt-4">
                <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Categories</p>
                <div className="grid gap-1">
                  <button
                    type="button"
                    onClick={() => chooseCategory("All")}
                    className={`flex items-center justify-between rounded-md px-2.5 py-2 text-left text-sm font-bold transition ${selectedCategory === "All" ? "bg-teal-50 text-teal-800" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`}
                  >
                    <span>All Products</span>
                    <span className="text-xs text-slate-400">{products.length}</span>
                  </button>
                  {categories.map((category) => (
                    <div key={category.key}>
                      <button
                        type="button"
                        onClick={() => chooseCategory(category.key)}
                        className={`flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-sm font-bold transition ${selectedCategory === category.key ? "bg-teal-50 text-teal-800" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`}
                      >
                        <span className="truncate">{category.name}</span>
                        <span className="shrink-0 text-xs text-slate-400">{category.count}</span>
                      </button>
                      {selectedCategory === category.key && (
                        <div className="my-1 grid gap-1 border-l-2 border-teal-100 pl-2">
                          {selectedCategoryProducts.length > 0 ? (
                            selectedCategoryProducts.map((product) => (
                              <button
                                key={product._id}
                                type="button"
                                onClick={() => selectProduct(product)}
                                className={`rounded-md px-2.5 py-2 text-left text-xs font-bold leading-5 transition ${selectedProductId === product._id ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-50 hover:text-teal-800"}`}
                              >
                                <span className="line-clamp-2">{product.title || "Untitled product"}</span>
                              </button>
                            ))
                          ) : (
                            <p className="rounded-md border border-dashed border-slate-200 px-3 py-4 text-xs font-bold text-slate-400">No products in this category.</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-4 rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-teal-700">
                    <PackageSearch className="h-4 w-4" /> Industrial Catalog
                  </p>
                  <h1 className="mt-1 text-2xl font-black text-slate-950">Products</h1>
                </div>
                <p className="text-sm font-bold text-slate-500">
                  {filteredProducts.length} of {products.length} products shown
                </p>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid gap-4">
                {selectedProduct && (
                  <CatalogProductRow
                    product={selectedProduct}
                    id="selected-product-specs"
                    active
                    activeImage={activeImages[selectedProduct._id]}
                    showDescription={expandedProductId === selectedProduct._id}
                    viewButtonLabel="View Product"
                    onImageChange={(image) => setProductImage(selectedProduct._id, image)}
                    onView={() => setExpandedProductId(selectedProduct._id)}
                    onInquiry={() => setInquiryProduct(selectedProduct)}
                  />
                )}

                {selectedProduct && (
                  <div className="mt-2 border-t border-slate-200 pt-4">
                    <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wide text-teal-700">More related products</p>
                        <h2 className="text-xl font-black text-slate-950">{selectedProduct.category || "Same category"}</h2>
                      </div>
                      <p className="text-sm font-bold text-slate-500">{relatedProducts.length} other products</p>
                    </div>
                    {relatedProducts.length > 0 ? (
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {relatedProducts.map((product) => (
                          <RelatedProductTile key={product._id} product={product} onView={() => selectProduct(product)} onInquiry={() => setInquiryProduct(product)} />
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-md border border-dashed border-slate-300 bg-white p-6 text-center text-sm font-bold text-slate-500">No other related products in this category.</div>
                    )}
                  </div>
                )}

                {!selectedProduct && filteredProducts.map((product) => (
                  <CatalogProductRow
                    key={product._id}
                    product={product}
                    id={`product-${product._id}`}
                    active={selectedProductId === product._id}
                    activeImage={activeImages[product._id]}
                    showDescription={false}
                    onImageChange={(image) => setProductImage(product._id, image)}
                    onView={() => viewProduct(product)}
                    onInquiry={() => setInquiryProduct(product)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">No products match the selected filters.</div>
            )}
          </div>
        </section>
      </main>

      <Footer companyInfo={companyInfo} />
      {inquiryProduct && <InquiryModal product={inquiryProduct} onClose={() => setInquiryProduct(null)} />}
    </div>
  );
}

function CatalogProductRow({ product, id, activeImage, showDescription = false, viewButtonLabel = "View Product", onImageChange, onView, onInquiry }) {
  const images = productImages(product);
  const specs = productSpecs(product);
  const detailScrollRef = useRef(null);
  const selectedImage = activeImage || images[0] || "";
  const activeImageIndex = Math.max(0, images.findIndex((image) => image === selectedImage));
  const showViewButton = !showDescription;
  const fixedImageLayout = showDescription;

  const showImage = (direction) => {
    if (images.length < 2) return;
    const currentIndex = activeImageIndex >= 0 ? activeImageIndex : 0;
    const nextIndex = direction === "next"
      ? (currentIndex + 1) % images.length
      : (currentIndex - 1 + images.length) % images.length;
    onImageChange(images[nextIndex]);
  };

  const scrollDetailsFromImage = (event) => {
    if (!fixedImageLayout) return;

    const details = detailScrollRef.current;
    if (!details) return;

    const maxScrollTop = details.scrollHeight - details.clientHeight;
    if (maxScrollTop <= 0) return;

    const atTop = details.scrollTop <= 0;
    const atBottom = details.scrollTop >= maxScrollTop - 1;
    const shouldReleasePageScroll = (event.deltaY > 0 && atBottom) || (event.deltaY < 0 && atTop);

    if (shouldReleasePageScroll) return;

    event.preventDefault();
    event.stopPropagation();
    details.scrollTop = Math.max(0, Math.min(maxScrollTop, details.scrollTop + event.deltaY));
  };

  return (
    <article id={id} className={`scroll-mt-24 overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 ${fixedImageLayout ? "xl:h-[min(680px,calc(100vh-8rem))]" : ""}`}>
      <div className={`grid gap-0 xl:grid-cols-[minmax(360px,0.92fr)_minmax(0,1.08fr)] ${fixedImageLayout ? "xl:h-full" : ""}`}>
        <div onWheelCapture={scrollDetailsFromImage} className={`flex flex-col items-center border-b border-slate-200 bg-slate-50 p-4 xl:border-b-0 xl:border-r ${fixedImageLayout ? "xl:h-full xl:overflow-hidden" : "xl:sticky xl:top-24 xl:self-start"}`}>
          <div className="relative aspect-square w-full max-w-[560px] overflow-hidden rounded-md border border-slate-200 bg-white">
            {selectedImage ? (
              <img src={uploadUrl(selectedImage)} alt={product.title} className="h-full w-full object-contain" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm font-bold text-slate-400">No image available</div>
            )}
            {images.length > 1 && (
              <>
                <button type="button" onClick={() => showImage("prev")} className="focus-ring absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-900 shadow-sm transition hover:border-slate-300 hover:text-teal-800" aria-label="Previous image">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button type="button" onClick={() => showImage("next")} className="focus-ring absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-900 shadow-sm transition hover:border-slate-300 hover:text-teal-800" aria-label="Next image">
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-3 right-3 rounded-full bg-slate-950/80 px-2.5 py-1 text-xs font-black text-white">
                  {activeImageIndex + 1}/{images.length}
                </div>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="no-scrollbar mt-3 flex max-w-[560px] justify-center gap-2 overflow-auto pb-1">
              {images.map((image, index) => (
                <button key={`${image}-${index}`} onClick={() => onImageChange(image)} className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-white p-1 transition hover:border-slate-300 ${selectedImage === image ? "border-slate-400 ring-2 ring-slate-100" : "border-slate-200"}`}>
                  <img src={uploadUrl(image)} alt={`${product.title} ${index + 1}`} className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div ref={detailScrollRef} className={`product-detail-scroll min-w-0 overflow-hidden p-5 xl:p-6 ${fixedImageLayout ? "xl:h-full xl:overflow-y-auto" : ""}`}>
          <p className="mb-2 text-xs font-black uppercase tracking-wide text-teal-700">{product.category || "Industrial Product"}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <button onClick={onView} className="min-w-0 cursor-pointer text-left">
              <h2 className="text-2xl font-black leading-tight text-slate-950 hover:text-teal-800 sm:text-[1.7rem]">{product.title || "Untitled product"}</h2>
            </button>
            {showViewButton && (
              <button onClick={onView} className="focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-slate-200 px-3.5 py-2 text-sm font-black text-slate-800 hover:border-slate-300 hover:text-teal-800">
                <FileText className="h-4 w-4" /> {viewButtonLabel}
              </button>
            )}
          </div>
          <p className="mt-2 text-xl font-black text-teal-800">{formatPrice(product.price)} <span className="text-xs font-bold text-slate-400">/ piece</span></p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={onInquiry} className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-[#21409a] px-3.5 py-2 text-sm font-black text-white shadow-sm hover:bg-[#00aeef]">
              <MessageSquare className="h-4 w-4" /> Send Inquiry
            </button>
            {product.ProductBroucher && (
              <a href={uploadUrl(product.ProductBroucher)} target="_blank" rel="noreferrer" className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-3.5 py-2 text-sm font-black text-slate-800 hover:border-slate-300 hover:text-teal-800">
                <Download className="h-4 w-4" /> Brochure
              </a>
            )}
            {product.Productvideo && (
              <a href={product.Productvideo} target="_blank" rel="noreferrer" className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-3.5 py-2 text-sm font-black text-slate-800 hover:border-slate-300 hover:text-teal-800">
                <PlayCircle className="h-4 w-4" /> Video
              </a>
            )}
          </div>

          <div className="mt-7">
            <div className="mb-3 flex items-center gap-2 text-lg font-black text-slate-950">
              <FileText className="h-5 w-5 text-teal-700" /> Technical Specifications
            </div>
            {specs.length > 0 ? (
              <div className="overflow-hidden rounded-md border border-slate-200">
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-slate-200">
                    {specs.map(([label, value]) => (
                      <tr key={label} className="bg-white">
                        <th className="w-2/5 bg-slate-50 px-4 py-3 align-top text-xs font-black uppercase tracking-wide text-slate-500">{label}</th>
                        <td className="px-4 py-3 font-bold text-slate-900">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-500">Specifications are not available for this product yet.</p>
            )}
          </div>

          {showDescription && (
            <div className="mt-7 border-t border-slate-200 pt-6">
              <h3 className="text-lg font-black text-slate-950">Product Description</h3>
              <p className="mt-3 text-justify leading-7 text-slate-600">{product.description || "Detailed product information available through inquiry."}</p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function RelatedProductTile({ product, onView, onInquiry }) {
  const image = productImages(product)[0] || "";

  return (
    <article className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:border-slate-300">
      <button type="button" onClick={onView} className="block aspect-[4/3] w-full bg-slate-50 p-3">
        {image ? (
          <img src={uploadUrl(image)} alt={product.title} className="h-full w-full object-contain" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs font-bold text-slate-400">No image available</div>
        )}
      </button>
      <div className="p-3">
        <p className="mb-1 line-clamp-1 text-[11px] font-black uppercase tracking-wide text-teal-700">{product.category || "Industrial Product"}</p>
        <button type="button" onClick={onView} className="cursor-pointer text-left">
          <h3 className="line-clamp-2 min-h-10 text-sm font-black leading-5 text-slate-950 hover:text-teal-800">{product.title || "Untitled product"}</h3>
        </button>
        <p className="mt-2 text-sm font-black text-teal-800">{formatPrice(product.price)}</p>
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={onView} className="focus-ring flex-1 rounded-md border border-slate-200 px-2.5 py-2 text-xs font-black text-slate-800 hover:border-slate-300 hover:text-teal-800">
            View →
          </button>
          <button type="button" onClick={onInquiry} className="focus-ring flex-1 rounded-md bg-[#21409a] px-2.5 py-2 text-xs font-black text-white hover:bg-[#00aeef]">
            Inquiry
          </button>
        </div>
      </div>
    </article>
  );
}
